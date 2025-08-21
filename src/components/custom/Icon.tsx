import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    primary?: string;
    secondary?: string;
}

const Icon = ({ icon: IconComponent, primary, secondary, style, ...props }: IconProps) => {
    const iconStyle: React.CSSProperties = {
        ...style,
    };

    if (primary) {
        iconStyle["--icon-primary-color"] = primary;
    }
    if (secondary) {
        iconStyle["--icon-secondary-color"] = secondary;
    }

    return <IconComponent style={iconStyle} {...props} />;
};

export default Icon;