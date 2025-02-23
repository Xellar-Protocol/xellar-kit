interface AvatarProps {
  name: string;
  size?: number;
}

export const Avatar = ({ name, size = 40 }: AvatarProps) => {
  // Generate consistent colors from string
  const getColors = (str: string) => {
    const hash = str.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    // Generate two different hues for gradient
    const hue1 = hash % 360;
    const hue2 = (hue1 + 40) % 360;

    return {
      color1: `hsl(${hue1}, 70%, 60%)`,
      color2: `hsl(${hue2}, 70%, 60%)`
    };
  };

  const { color1, color2 } = getColors(name);

  const style = {
    width: size,
    height: size,
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${color1}, ${color2})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: size * 0.4,
    fontWeight: 'bold',
    userSelect: 'none'
  } as React.CSSProperties;

  return <div style={style} />;
};
