import { useNavigate } from 'react-router-dom';
import BackbuttonIcon from '@/assets/icons/icon_backbutton.svg?react';

interface BackButtonProps {
  className : string;
}

export const BackButton = ({className}:BackButtonProps) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <button
      onClick={handleGoBack}
      className={className} 
      type="button"
    >
      <BackbuttonIcon className="w-full h-full" /> 
    </button> 
  );
};