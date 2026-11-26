import crypto from 'node:crypto';
import { containsInsensitive } from '../config/database-capabilities.js';
import bcrypt from 'bcrypt';
import prisma from '../config/prisma.js';

const safeUser = { id: true, name: true, surname: true, email: true, role: true, isActive: true, mustChangePassword: true, createdAt: true, lastLoginAt: true };
const emailOk = (v) => typeof v === 'string' && v.trim().length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export async function sendEmailTest(req, res) {
 try {
  const { getEmailReadiness, sendTestEmail } = await import('../services/email.service.js');
  const readiness = getEmailReadiness();
  if (!readiness.configured) return res.status(503).json({ error: 'Email service is not configured.', missing: readiness.missing });
  const { email } = await prisma.user.findUnique({ where: { id: req.userId }, select: { email: true } }) || {};
  if (!emailOk(email)) return res.status(400).json({ error: 'Your account does not have a valid email address.' });
  const result = await sendTestEmail(email);
  return res.json({ accepted: true, messageId: result.id, status: result.status, recipient: email });
 } catch { return res.status(502).json({ error: 'Email test request failed.' }); }
}
const audit = (actorId, action, targetId = null, details = undefined) => prisma.administratorActivity.create({ data: { actorId, targetId, action, ...(details ? { details } : {}) } });
const issueInvitationToken = async (userId) => {
 const token = crypto.randomBytes(32).toString('base64url');
 const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
 const now = new Date();
 await prisma.$transaction([
  prisma.passwordResetToken.updateMany({ where: { userId, usedAt: null }, data: { usedAt: now } }),
  prisma.passwordResetToken.create({ data: { userId, tokenHash, expiresAt: new Date(now.getTime() + 72 * 60 * 60 * 1000) } }),
 ]);
 return token;
};

export async function dashboard(req, res, next) {
 try {
  const [admins, activeAdmins, inactiveAdmins, students, recentActivity, recentAdmins] = await Promise.all([
   prisma.user.count({ where: { role: { in: ['ADMIN','SUPER_ADMIN'] } } }), prisma.user.count({ where: { role: { in: ['ADMIN','SUPER_ADMIN'] }, isActive: true } }),
   prisma.user.count({ where: { role: { in: ['ADMIN','SUPER_ADMIN'] }, isActive: false } }), prisma.user.count({ where: { role: 'STUDENT' } }),
   prisma.administratorActivity.findMany({ take: 8, orderBy: { createdAt: 'desc' }, include: { actor: { select: { name: true, surname: true } }, target: { select: { name: true, surname: true, email: true } } } }),
   prisma.user.findMany({ where: { role: 'ADMIN' }, take: 5, orderBy: { createdAt: 'desc' }, select: safeUser }),
  ]);
  res.json({ totals: { administrators: admins, activeAdministrators: activeAdmins, inactiveAdministrators: inactiveAdmins, students }, recentActivity, recentAdministrators: recentAdmins, system: { node: process.version, environment: process.env.NODE_ENV || 'development' } });
 } catch(e) { next(e); }
}
export async function listAdmins(req,res,next) { try {
 const page=Math.max(1,Number.parseInt(req.query.page,10)||1), limit=Math.min(100,Math.max(1,Number.parseInt(req.query.limit,10)||10));
 const where={role:'ADMIN', ...(req.query.status==='active'?{isActive:true}:req.query.status==='inactive'?{isActive:false}:{}), ...(req.query.search?{OR:[{name:containsInsensitive(String(req.query.search))},{surname:containsInsensitive(String(req.query.search))},{email:containsInsensitive(String(req.query.search))}]}:{})};
 const [items,total]=await Promise.all([prisma.user.findMany({where,select:safeUser,orderBy:{createdAt:'desc'},skip:(page-1)*limit,take:limit}),prisma.user.count({where})]); res.json({items,total,page,limit});
 }catch(e){next(e);} }
export async function getAdmin(req,res,next){try{const item=await prisma.user.findFirst({where:{id:req.params.id,role:'ADMIN'},select:safeUser}); if(!item)return res.status(404).json({error:'Administrator not found.'});res.json({item});}catch(e){next(e);}}
export async function createAdmin(req,res,next){
 const {name,surname,email}=req.body||{}; if(typeof name!=='string'||!name.trim()||typeof surname!=='string'||!surname.trim()||!emailOk(email))return res.status(400).json({error:'Enter a first name, surname, and valid email.'});
 const normalized=email.trim().toLowerCase(); let user;
 try {
  if(await prisma.user.findUnique({where:{email:normalized},select:{id:true}}))return res.status(409).json({error:'This email is already registered.'});
  user=await prisma.user.create({data:{name:name.trim(),surname:surname.trim(),email:normalized,password:await bcrypt.hash(crypto.randomBytes(32).toString('base64url'),12),role:'ADMIN',mustChangePassword:true},select:safeUser});
  let invitationEmailStatus='accepted';
  try { const token=await issueInvitationToken(user.id); const {sendAdminInvitation}=await import('../services/email.service.js'); await sendAdminInvitation(user,token); }
  catch { invitationEmailStatus='failed'; console.warn('Administrator invitation email could not be sent.'); }
  await audit(req.userId,'ADMIN_CREATED',user.id,{invitationEmailStatus}); return res.status(201).json({item:user,invitationEmailStatus});
 }catch(e){if(e?.code==='P2002')return res.status(409).json({error:'This email is already registered.'});next(e);}
}
export async function updateAdmin(req,res,next){const {name,surname}=req.body||{};if(typeof name!=='string'||!name.trim()||typeof surname!=='string'||!surname.trim())return res.status(400).json({error:'Name and surname are required.'});try{const row=await prisma.user.findFirst({where:{id:req.params.id,role:'ADMIN'}});if(!row)return res.status(404).json({error:'Administrator not found.'});const item=await prisma.user.update({where:{id:row.id},data:{name:name.trim(),surname:surname.trim()},select:safeUser});await audit(req.userId,'ADMIN_PROFILE_UPDATED',row.id);res.json({item});}catch(e){next(e);}}
export async function setAdminStatus(req,res,next){const isActive=req.body?.isActive;if(typeof isActive!=='boolean')return res.status(400).json({error:'isActive must be true or false.'});try{const row=await prisma.user.findFirst({where:{id:req.params.id,role:'ADMIN'}});if(!row)return res.status(404).json({error:'Administrator not found.'});const item=await prisma.user.update({where:{id:row.id},data:{isActive,authVersion:{increment:1}},select:safeUser});await audit(req.userId,isActive?'ADMIN_ACTIVATED':'ADMIN_DEACTIVATED',row.id);res.json({item});}catch(e){next(e);}}
export async function deleteAdmin(req,res,next){try{if(req.params.id===req.userId)return res.status(400).json({error:'You cannot delete your own account.'});const row=await prisma.user.findFirst({where:{id:req.params.id,role:'ADMIN'}});if(!row)return res.status(404).json({error:'Administrator not found.'});await audit(req.userId,'ADMIN_DELETED',row.id,{email:row.email});await prisma.user.delete({where:{id:row.id}});res.json({message:'Administrator deleted.'});}catch(e){next(e);}}
export async function resendInvitation(req,res,next){try{const row=await prisma.user.findFirst({where:{id:req.params.id,role:'ADMIN'}});if(!row)return res.status(404).json({error:'Administrator not found.'});try{const token=await issueInvitationToken(row.id);const {sendAdminInvitation}=await import('../services/email.service.js');await sendAdminInvitation(row,token);}catch{await audit(req.userId,'ADMIN_INVITATION_FAILED',row.id,{reason:'Invitation email could not be sent.'});return res.status(502).json({error:'Invitation email could not be sent. Existing account credentials are unchanged.'});}await audit(req.userId,'ADMIN_INVITATION_RESENT',row.id);res.json({message:'Invitation sent.'});}catch(e){next(e);}}
export async function activity(req,res,next){try{const items=await prisma.administratorActivity.findMany({take:Math.min(100,Number.parseInt(req.query.limit,10)||50),orderBy:{createdAt:'desc'},include:{actor:{select:{name:true,surname:true,email:true}},target:{select:{name:true,surname:true,email:true}}}});res.json({items});}catch(e){next(e);}}
export async function adminDashboard(_req,res,next){try{const [students,activity,enquiries]=await Promise.all([prisma.user.count({where:{role:'STUDENT'}}),prisma.administratorActivity.findMany({take:8,orderBy:{createdAt:'desc'},select:{action:true,createdAt:true}}),prisma.applicationEnquiry.groupBy({by:['status'],_count:{_all:true}})]);const statusCounts=Object.fromEntries(enquiries.map(({status,_count})=>[status,_count._all]));const totalEnquiries=enquiries.reduce((sum,item)=>sum+item._count._all,0);res.json({totals:{students,enquiries:totalEnquiries,newEnquiries:statusCounts.SUBMITTED||0,underReview:statusCounts.UNDER_REVIEW||0,awaitingDocuments:statusCounts.AWAITING_DOCUMENTS||0,completed:statusCounts.COMPLETED||0},recentActivity:activity,modules:['application-enquiries']});}catch(e){next(e);}}
export async function listStudents(req,res,next){try{const page=Math.max(1,Number.parseInt(req.query.page,10)||1),limit=Math.min(100,Math.max(1,Number.parseInt(req.query.limit,10)||20));const search=String(req.query.search||'');const where={role:'STUDENT',...(search?{OR:[{name:containsInsensitive(search)},{surname:containsInsensitive(search)},{email:containsInsensitive(search)}]}:{})};const [items,total]=await Promise.all([prisma.user.findMany({where,select:{id:true,name:true,surname:true,email:true,isActive:true,createdAt:true,lastLoginAt:true},orderBy:{createdAt:'desc'},skip:(page-1)*limit,take:limit}),prisma.user.count({where})]);res.json({items,total,page,limit});}catch(e){next(e);}}
export async function profile(req,res,next){try{const user=await prisma.user.findUnique({where:{id:req.userId},select:safeUser});res.json({user});}catch(e){next(e);}}
export async function changePassword(req,res,next){const {currentPassword,newPassword,confirmPassword}=req.body||{};if(typeof currentPassword!=='string'||typeof newPassword!=='string'||newPassword.length<12||!/[A-Z]/.test(newPassword)||!/[a-z]/.test(newPassword)||!/[0-9]/.test(newPassword)||newPassword!==confirmPassword)return res.status(400).json({error:'Use a matching password of at least 12 characters with uppercase, lowercase, and a number.'});try{const user=await prisma.user.findUnique({where:{id:req.userId}});if(!await bcrypt.compare(currentPassword,user.password))return res.status(400).json({error:'Current password is incorrect.'});await prisma.user.update({where:{id:req.userId},data:{password:await bcrypt.hash(newPassword,12),mustChangePassword:false,authVersion:{increment:1}}});await audit(req.userId,'ADMIN_PASSWORD_CHANGED');res.clearCookie('authToken',{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/'});res.json({message:'Password changed. Please sign in again.'});}catch(e){next(e);}}
