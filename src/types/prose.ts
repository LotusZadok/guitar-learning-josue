import type { NoteSpelling } from './music';

export type ProseFragment =
  | { type: 'text'; value: string }
  | { type: 'note'; value: NoteSpelling };

export type ProseSegment = readonly ProseFragment[];
