export const VersionPage = () => {
  return (
    <table>
      <thead>
        <tr>
          <th>Pipeline UUID</th>
          <th>Commit</th>
          <th>Tag</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{process.env.BITBUCKET_PIPELINE_UUID ?? 'MANUAL'}</td>
          <td>{process.env.BITBUCKET_COMMIT ?? 'MANUAL'}</td>
          <td>{process.env.BITBUCKET_TAG ?? 'MANUAL'}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default VersionPage;
