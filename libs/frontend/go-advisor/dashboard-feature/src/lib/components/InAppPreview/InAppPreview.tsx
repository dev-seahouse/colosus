import {
  styled,
  Box,
  Toolbar,
  Card,
  ButtonGroup,
  Button,
} from '@bambu/react-ui';
import { useSelectTenantUrlQuery } from '@bambu/go-advisor-core';
import { useState } from 'react';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import PersonalVideoIcon from '@mui/icons-material/PersonalVideo';
import InAppPreviewButton from './InAppPreviewButton';

const StyledIframe = styled('iframe')({
  border: 'none',
  overflow: 'hidden',
});

export const ViewEnum = {
  mobile: 'mobile',
  desktop: 'desktop',
} as const;

export type View = keyof typeof ViewEnum;

const IframeSize = {
  mobile: {
    width: 375,
    height: 812,
  },
  desktop: {
    width: '100%',
    height: 768,
  },
};

export function InAppPreview() {
  const { data: tenantUrl } = useSelectTenantUrlQuery();
  const [view, setView] = useState<View>('mobile');
  const isPreviewingMobile = view === 'mobile';

  return (
    <Card>
      <Toolbar sx={{ justifyContent: 'flex-end' }}>
        <ButtonGroup aria-label="choose preview mode">
          <InAppPreviewButton
            aria-label={`${
              isPreviewingMobile ? 'previewing' : 'click to preview'
            } app in mobile mode`}
            active={isPreviewingMobile}
            onClick={() => setView('mobile')}
          >
            <SmartphoneIcon />
          </InAppPreviewButton>
          <InAppPreviewButton
            aria-label={`${
              !isPreviewingMobile ? 'previewing' : 'click to preview'
            } app in desktop mode`}
            active={!isPreviewingMobile}
            onClick={() => setView('desktop')}
          >
            <PersonalVideoIcon />
          </InAppPreviewButton>
        </ButtonGroup>
      </Toolbar>
      <Box display="flex" justifyContent="space-around">
        <StyledIframe
          aria-label={`app ${
            isPreviewingMobile ? 'mobile' : 'desktop'
          } preview`}
          src={`${tenantUrl}?iframe=true`}
          width={IframeSize[view].width}
          height={IframeSize[view].height}
          title={`app ${isPreviewingMobile ? 'mobile' : 'desktop'} preview`}
          style={{ overflow: 'hidden' }}
          seamless={true}
        />
      </Box>
    </Card>
  );
}

export default InAppPreview;
