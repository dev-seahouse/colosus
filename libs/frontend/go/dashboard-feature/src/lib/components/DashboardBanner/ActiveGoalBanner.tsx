import DashboardBannerLayout from '../../layouts/DashboardBannerLayout/DashboardBannerLayout';

export function ActiveGoalBanner({
  name,
  goalDescription,
}: {
  name: string;
  goalDescription: string;
}) {
  return (
    <DashboardBannerLayout
      title={'Congratulation ' + name}
      description={`Your "${goalDescription}" goal is active now. Sit back and relax.`}
    />
  );
}

export default ActiveGoalBanner;
