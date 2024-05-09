import { Accordion } from '@bambu/react-ui';
import type { SvgIcon } from '@bambu/react-ui';
import { NAVBAR_ICON } from '@bambu/go-advisor-core';
import { useState, useMemo } from 'react';
import type { SyntheticEvent } from 'react';
import { useFeatureFlag } from '@harnessio/ff-react-client-sdk';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import GavelIcon from '@mui/icons-material/Gavel';
import PaymentIcon from '@mui/icons-material/Payment';
import { useSelectUnfinishedTaskIndexQuery } from '@bambu/go-advisor-core';

import ClientExperienceAccordionSummary from './ClientExperienceAccordionSummary';
import ProfileAccordionStatus from './ProfileAccordion/ProfileAccordionStatus';
import ProfileAccordionDetails from './ProfileAccordion/ProfileAccordionDetails';
import BrandingAccordionDetails from './BrandingAccordion/BrandingAccordionDetails';
import BrandingAccordionStatus from './BrandingAccordion/BrandingAccordionStatus';
import GoalsAccordionDetails from './GoalsAccordion/GoalsAccordionDetails';
import GoalsAccordionStatus from './GoalsAccordion/GoalsAccordionStatus';
import PortfoliosAccordionDetails from './PortfoliosAccordion/PortfoliosAccordionDetails';
import PortfoliosAccordionStatus from './PortfoliosAccordion/PortfoliosAccordionStatus';
import ContentAccordionDetails from './ContentAccordion/ContentAccordionDetails';
import ContentAccordionStatus from './ContentAccordion/ContentAccordionStatus';
import RegulatoryAccordionStatus from './RegulatoryAccordion/RegulatoryAccordionStatus';
import RegulatoryAccordionDetails from './RegulatoryAccordion/RegulatoryAccordionDetails';
import SubscriptionAccordionStatus from './SubscriptionAccordion/SubscriptionAccordionStatus';
import SubscriptionAccordionDetails from './SubscriptionAccordion/SubscriptionAccordionDetails';

const { BRANDING, GOALS, CONTENT, SETTINGS, PORTFOLIOS } = NAVBAR_ICON;

export function ClientExperienceAccordion() {
  const index = useSelectUnfinishedTaskIndexQuery();
  const [expanded, setExpanded] = useState<string | false>(`panel-${index}`);
  const isSettingsEnabled = useFeatureFlag('feature_settings');

  const CLIENT_EXPERIENCE_SECTION = useMemo(
    () => [
      {
        label: 'Make this platform yours',
        icon: FingerprintIcon,
        details: <ProfileAccordionDetails />,
        status: <ProfileAccordionStatus />,
      },
      {
        label: 'Brand your client platform',
        icon: BRANDING,
        details: <BrandingAccordionDetails />,
        status: <BrandingAccordionStatus />,
      },
      {
        label: 'Manage goals',
        icon: GOALS,
        details: <GoalsAccordionDetails />,
        status: <GoalsAccordionStatus />,
      },
      {
        label: 'Configure your portfolios',
        icon: PORTFOLIOS as typeof SvgIcon,
        details: <PortfoliosAccordionDetails />,
        status: <PortfoliosAccordionStatus />,
      },
      {
        label: 'Customize content',
        icon: CONTENT,
        details: <ContentAccordionDetails />,
        status: <ContentAccordionStatus />,
      },
      // ...(isSettingsEnabled
      //   ? [
      //       {
      //         label: 'Set up leads filtering',
      //         icon: SETTINGS,
      //       },
      //     ]
      //   : []),
      {
        label: 'Comply with regulatory requirements',
        icon: GavelIcon,
        details: <RegulatoryAccordionDetails />,
        status: <RegulatoryAccordionStatus />,
      },
      {
        label: 'Subscribe to Bambu GO',
        icon: PaymentIcon,
        details: <SubscriptionAccordionDetails />,
        status: <SubscriptionAccordionStatus />,
      },
    ],
    [isSettingsEnabled]
  );

  const handleChange =
    (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <>
      {CLIENT_EXPERIENCE_SECTION.map((clientExperience, i) => {
        const { label, icon, status, details } = clientExperience;
        const key = `panel-${i}`;

        return (
          <Accordion
            key={key}
            disableGutters
            expanded={expanded === key}
            onChange={handleChange(key)}
          >
            <ClientExperienceAccordionSummary
              StartIcon={icon}
              label={`${i + 1}. ${label}`}
              status={status}
            />
            {details}
          </Accordion>
        );
      })}
    </>
  );
}

export default ClientExperienceAccordion;
