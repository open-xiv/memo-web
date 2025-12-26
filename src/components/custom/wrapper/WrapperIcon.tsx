import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    primary?: string;
    secondary?: string;
}

const WrapperIcon = ({ icon: IconComponent, primary, secondary, style, className, ...props }: IconProps) => {

    const primaryColor = primary || "currentColor";
    const secondaryColor = secondary || "currentColor";

    const iconStyle = {
        "--icon-primary-color": primaryColor,
        "--icon-secondary-color": secondaryColor,
        ...style,
    } as React.CSSProperties;

    return (
            <IconComponent
                    className={className}
                    style={iconStyle}
                    {...props}
            />
    );
};

export default WrapperIcon;