import { SVGProps } from 'react';

export const CopyIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={15}
    height={16}
    viewBox="0 0 15 16"
    fill="none"
    {...props}
  >
    <path
      fill={props.color || '#fff'}
      d="M14.375.5h-10a.625.625 0 0 0-.625.625V4.25H.625A.625.625 0 0 0 0 4.875v10a.625.625 0 0 0 .625.625h10a.624.624 0 0 0 .625-.625V11.75h3.125a.624.624 0 0 0 .625-.625v-10A.625.625 0 0 0 14.375.5ZM10 14.25H1.25V5.5H10v8.75Zm3.75-3.75h-2.5V4.875a.625.625 0 0 0-.625-.625H5v-2.5h8.75v8.75Z"
    />
  </svg>
);
