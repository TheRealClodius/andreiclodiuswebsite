import React from 'react'

interface CustomLogoProps {
  size?: number
  className?: string
  fill?: string
}

export const CustomLogo: React.FC<CustomLogoProps> = ({ 
  size = 20, 
  className,
  fill = "white"
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 152 152" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M75.0402 3.28195C75.3207 2.32287 76.6793 2.32287 76.9598 3.28195L87.9856 40.9836C91.2904 52.2843 99.4062 61.555 110.171 66.3256L132 76L110.171 85.6744C99.4062 90.445 91.2904 99.7157 87.9856 111.016L76.9598 148.718C76.6793 149.677 75.3207 149.677 75.0402 148.718L64.0144 111.016C60.7096 99.7157 52.5938 90.445 41.8295 85.6744L20 76L41.8295 66.3256C52.5938 61.555 60.7096 52.2843 64.0144 40.9836L75.0402 3.28195Z" 
        fill={fill}
      />
      <circle cx="123" cy="26" r="9" fill={fill} />
    </svg>
  )
}
