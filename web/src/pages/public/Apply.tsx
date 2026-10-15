import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JoinCommunityModal } from '../../components/auth/JoinCommunityModal';

export const Apply: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    navigate('/');
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <JoinCommunityModal
        isOpen={isOpen}
        onClose={handleClose}
        onSuccess={() => {}}
      />
    </div>
  );
};
