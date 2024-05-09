import {
  useSelectHasUserCompletedContactMeQuery,
  EditButton,
  PendingActionButton,
} from '@bambu/go-advisor-core';
import { useNavigate } from 'react-router-dom';

export const ContactMeAction = () => {
  const { data: hasUserCompletedContactMe } =
    useSelectHasUserCompletedContactMeQuery();
  const navigate = useNavigate();

  const handleClick = () => navigate('reasons-to-contact-me');

  if (hasUserCompletedContactMe) {
    return <EditButton onClick={handleClick} />;
  }

  return <PendingActionButton onClick={handleClick} />;
};

export default ContactMeAction;
