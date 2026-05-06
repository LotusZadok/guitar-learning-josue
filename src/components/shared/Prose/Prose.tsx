import { Fragment } from 'react';
import NoteToken from '../NoteToken/NoteToken';
import type { ProseSegment } from '../../../types/prose';

interface ProseProps {
  segment: ProseSegment;
}

export default function Prose({ segment }: ProseProps) {
  return (
    <>
      {segment.map((frag, i) =>
        frag.type === 'text' ? (
          <Fragment key={i}>{frag.value}</Fragment>
        ) : (
          <NoteToken key={i} note={frag.value} />
        ),
      )}
    </>
  );
}
