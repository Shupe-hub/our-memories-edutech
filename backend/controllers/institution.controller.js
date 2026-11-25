import prisma from '../config/prisma.js';

const institutionSelect = { id: true, name: true, officialName: true, aliases: true, type: true, province: true, website: true, websiteVerified: true, locationVerified: true, isLegacy: true };

export async function listInstitutions(req, res) {
    const search = typeof req.query.search === 'string' ? req.query.search.trim().slice(0, 100) : '';
    const type = ['UNIVERSITY', 'UNIVERSITY_OF_TECHNOLOGY', 'OTHER'].includes(req.query.type) ? req.query.type : undefined;
    const province = typeof req.query.province === 'string' ? req.query.province.trim().slice(0, 60) : '';
    try {
        const items = await prisma.institution.findMany({
            where: {
                ...(type ? { type } : {}),
                ...(province ? { province } : {}),
                ...(search ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { officialName: { contains: search, mode: 'insensitive' } }, { aliases: { hasSome: [search] } }] } : {}),
            },
            select: institutionSelect,
            orderBy: [{ isLegacy: 'asc' }, { name: 'asc' }],
            take: 100,
        });
        return res.json({ items });
    } catch { return res.status(500).json({ error: 'The institution directory is unavailable.' }); }
}

export async function getInstitution(req, res) {
    try {
        const item = await prisma.institution.findUnique({ where: { id: req.params.id }, select: institutionSelect });
        if (!item) return res.status(404).json({ error: 'Institution not found.' });
        return res.json({ institution: item });
    } catch { return res.status(400).json({ error: 'Institution not found.' }); }
}
