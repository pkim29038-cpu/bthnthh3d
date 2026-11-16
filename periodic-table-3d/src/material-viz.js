/**
 * Public compatibility layer for the original element detail page.
 * Source of truth: specimen-profiles.js; procedural shapes: specimen-renderer.js.
 */
export {MaterialViz} from './specimen-renderer.js';
import {specimenProfile} from './specimen-profiles.js';
export function materialInfo(element){
  const profile=specimenProfile(element);
  return {
    ...profile,
    representative:profile.kind!=='unobserved',
    speculative:profile.kind==='unobserved'
  };
}
