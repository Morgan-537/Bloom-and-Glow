// Stand-in for any .css/.scss file a component imports during a Jest test —
// Jest never actually needs to apply styles, just avoid choking on the import.
module.exports = {};
