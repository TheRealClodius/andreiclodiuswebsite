import React from 'react'

interface ClockLogoProps {
  size?: number
  className?: string
  primaryColor?: string
  secondaryColor?: string
}

export const ClockLogo: React.FC<ClockLogoProps> = ({ 
  size = 24, 
  className,
  primaryColor = "#748395",
  secondaryColor = "white"
}) => {
  // Calculate proportional width based on the original 280x259 aspect ratio
  const width = size * (280/259)
  
  return (
    <svg 
      width={width} 
      height={size} 
      viewBox="0 0 280 259" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transition: 'all 150ms ease-out' }}
    >
      {/* Shadow/outline paths - use primary color */}
      <path d="M233.022 234.795H68.6641V258.281H233.022V234.795Z" fill={primaryColor}/>
      <path d="M233.022 0H68.6641V23.4857H233.022V0Z" fill={primaryColor}/>
      <path d="M68.6888 211.329H45.2031V234.815H68.6888V211.329Z" fill={primaryColor}/>
      <path d="M256.509 23.4854H233.023V46.971H256.509V23.4854Z" fill={primaryColor}/>
      <path d="M45.2044 46.9717H21.7188V211.33H45.2044V46.9717Z" fill={primaryColor}/>
      <path d="M279.997 46.9717H256.512V211.33H279.997V46.9717Z" fill={primaryColor}/>
      <path d="M256.509 211.329H233.023V234.815H256.509V211.329Z" fill={primaryColor}/>
      <path d="M68.6888 23.4854H45.2031V46.971H68.6888V23.4854Z" fill={primaryColor}/>
      <path d="M162.591 46.9717H139.105V140.894H162.591V46.9717Z" fill={primaryColor}/>
      <path d="M186.079 140.872H162.594V164.379H186.079V187.843H209.565V164.358H186.079V140.872Z" fill={primaryColor}/>
      
      {/* Main/foreground paths - use secondary color */}
      <path d="M211.303 234.795H46.9453V258.281H211.303V234.795Z" fill={secondaryColor}/>
      <path d="M211.303 0H46.9453V23.4857H211.303V0Z" fill={secondaryColor}/>
      <path d="M46.9701 211.329H23.4844V234.815H46.9701V211.329Z" fill={secondaryColor}/>
      <path d="M234.79 23.4854H211.305V46.971H234.79V23.4854Z" fill={secondaryColor}/>
      <path d="M23.4857 46.9717H0V211.33H23.4857V46.9717Z" fill={secondaryColor}/>
      <path d="M258.279 46.9717H234.793V211.33H258.279V46.9717Z" fill={secondaryColor}/>
      <path d="M234.79 211.329H211.305V234.815H234.79V211.329Z" fill={secondaryColor}/>
      <path d="M46.9701 23.4854H23.4844V46.971H46.9701V23.4854Z" fill={secondaryColor}/>
      <path d="M140.872 46.9717H117.387V140.894H140.872V46.9717Z" fill={secondaryColor}/>
      <path d="M164.361 140.872H140.875V164.379H164.361V187.843H187.846V164.358H164.361V140.872Z" fill={secondaryColor}/>
    </svg>
  )
}
