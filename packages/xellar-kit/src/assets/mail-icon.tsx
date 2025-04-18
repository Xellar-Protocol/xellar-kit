import { SVGProps } from 'react';
import { useTheme } from 'styled-components';

export const MailIcon = (props: SVGProps<SVGSVGElement>) => {
  const { colors } = useTheme();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke={colors.TEXT}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      className="lucide lucide-mail"
      {...props}
    >
      <rect width={20} height={16} x={2} y={4} rx={2} />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
};

export const KeyIcon = (props: SVGProps<SVGSVGElement>) => {
  const { colors } = useTheme();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke={colors.TEXT}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      className="lucide lucide-key-square-icon lucide-key-square"
      {...props}
    >
      <path d="M12.4 2.7a2.5 2.5 0 0 1 3.4 0l5.5 5.5a2.5 2.5 0 0 1 0 3.4l-3.7 3.7a2.5 2.5 0 0 1-3.4 0L8.7 9.8a2.5 2.5 0 0 1 0-3.4zM14 7l3 3M9.4 10.6l-6.814 6.814A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814" />
    </svg>
  );
};
