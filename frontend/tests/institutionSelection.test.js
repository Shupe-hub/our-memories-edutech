import test from 'node:test';
import assert from 'node:assert/strict';
import { matchPath } from 'react-router-dom';
import { filterInstitutions, normalizeInstitutionSelection, toggleInstitutionSelection } from '../src/components/shared/institutionSelection.js';

const institutions = [
  { id: 'uj', name: 'University of Johannesburg', officialName: 'University of Johannesburg', province: 'Gauteng' },
  { id: 'uct', name: 'University of Cape Town', officialName: 'University of Cape Town', province: 'Western Cape' },
  { id: 'legacy', name: 'Old University Name', officialName: 'Old University Name', isLegacy: true },
];

test('selects multiple unique institutions and removes a selected institution', () => {
  const selected = toggleInstitutionSelection(toggleInstitutionSelection([], 'uj'), 'uct');
  assert.deepEqual(selected, ['uj', 'uct']);
  assert.deepEqual(toggleInstitutionSelection(selected, 'uj'), ['uct']);
});

test('normalizes duplicate selections and enforces the 20 institution limit', () => {
  const duplicated = normalizeInstitutionSelection(['uj', 'uj', 'uct']);
  assert.deepEqual(duplicated, ['uj', 'uct']);
  const twenty = Array.from({ length: 20 }, (_, index) => `id-${index}`);
  assert.deepEqual(toggleInstitutionSelection(twenty, 'id-20'), twenty);
  assert.equal(toggleInstitutionSelection(twenty, 'id-0').length, 19);
});

test('searches names, aliases and official names while hiding legacy records', () => {
  const matches = filterInstitutions(institutions, ' cape town ');
  assert.deepEqual(matches.map(({ id }) => id), ['uct']);
  assert.deepEqual(filterInstitutions(institutions, 'old university'), []);
});

test('sidebar application links match only their exact routes', () => {
  assert.ok(matchPath({ path: '/account/applications', end: true }, '/account/applications'));
  assert.equal(matchPath({ path: '/account/applications', end: true }, '/account/applications/new'), null);
  assert.ok(matchPath({ path: '/account/applications/new', end: true }, '/account/applications/new'));
  assert.equal(matchPath({ path: '/account/applications/new', end: true }, '/account/applications/new/extra'), null);
  assert.ok(matchPath({ path: '/account/explore', end: true }, '/account/explore'));
  assert.equal(matchPath({ path: '/account/explore', end: true }, '/account/explore/university'), null);
});
