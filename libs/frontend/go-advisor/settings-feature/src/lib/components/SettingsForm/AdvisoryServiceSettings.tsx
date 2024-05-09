// import {
//   Grid,
//   Typography,
//   Stack,
//   CurrencyField,
//   InputAdornment,
// } from '@bambu/react-ui';
// import { Controller, useFormContext } from 'react-hook-form';
// import SettingsFormCard from './SettingsFormCard';
// import SettingsFormTitle from './SettingsFormTitle';

// import type { SettingsFormState } from './SettingsForm';

// export const AdvisoryServiceSettings = () => {
//   const {
//     control,
//     formState: { errors },
//   } = useFormContext<SettingsFormState>();

//   return (
//     <SettingsFormCard data-testid="advisory-service-settings">
//       <Grid spacing={3} container>
//         <Grid item xs={6}>
//           <Stack spacing={2}>
//             <SettingsFormTitle>
//               Minimum income / savings for your advisory service
//             </SettingsFormTitle>
//             <Stack spacing={4}>
//               <Typography>
//                 This setting acts as a filter so that only people who earn or
//                 have a certain amount of money and above can schedule a meeting
//                 with you.
//               </Typography>
//               <Typography>
//                 Those who earn or have less than the set threshold, will see the
//                 teaser for the upcoming Bambu GO Transact.
//               </Typography>
//             </Stack>
//           </Stack>
//         </Grid>
//         <Grid item xs={6}>
//           <Stack spacing={2}>
//             <Controller
//               render={({ field: { onChange, value } }) => (
//                 <CurrencyField
//                   prefix=""
//                   inputProps={{
//                     'data-testid': 'minimum-income-input',
//                     id: 'minimum-income-input',
//                   }}
//                   InputLabelProps={{
//                     htmlFor: 'minimum-income-input',
//                   }}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">$</InputAdornment>
//                     ),
//                   }}
//                   label="Minimum income for salaried client"
//                   value={value}
//                   onValueChange={(e) => {
//                     onChange(e.floatValue);
//                   }}
//                   error={!!errors.incomeThreshold}
//                   helperText={errors?.incomeThreshold?.message}
//                 />
//               )}
//               control={control}
//               name="incomeThreshold"
//             />
//             <Controller
//               render={({ field: { onChange, value } }) => (
//                 <CurrencyField
//                   prefix=""
//                   inputProps={{
//                     'data-testid': 'minimum-saving-input',
//                     id: 'minimum-saving-input',
//                   }}
//                   InputLabelProps={{
//                     htmlFor: 'minimum-saving-input',
//                   }}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">$</InputAdornment>
//                     ),
//                   }}
//                   label="Minimum saving for retired client"
//                   value={value}
//                   onValueChange={(e) => {
//                     onChange(e.floatValue);
//                   }}
//                   error={!!errors.retireeSavingsThreshold}
//                   helperText={errors?.retireeSavingsThreshold?.message}
//                 />
//               )}
//               control={control}
//               name="retireeSavingsThreshold"
//             />
//           </Stack>
//         </Grid>
//       </Grid>
//     </SettingsFormCard>
//   );
// };

// export default AdvisoryServiceSettings;
