import Table from './tables/Table';
import Form from './forms/Form';

function Admin() {
  let adminPath = window.location.pathname.split('/admin/')[1];
  if (adminPath && adminPath.indexOf('/') > -1)
    adminPath = adminPath.split('/')[0];
  let adminSectionDisplay;

  switch (adminPath) {
    case 'pages':
      adminSectionDisplay = <Table type="pages" />;
      break;
    case 'news':
      adminSectionDisplay = <Table type="news" />;
      break;
    case 'messages':
      adminSectionDisplay = <Table type="messages" />;
      break;
    case 'crew':
      adminSectionDisplay = <Table type="crew" />;
      break;
    case 'create':
      adminSectionDisplay = <Form type="create" />;
      break;
    case 'edit':
      adminSectionDisplay = <Form type="edit" />;
      break;
    default:
      adminSectionDisplay = <Table type="pages" />;
      break;
  }

  return (
    <div className="page">
      <section className="ui container" id="admin">
        <h1>Admin</h1>
        <div className="ui secondary pointing menu">
          <a
            className={'item ' + (adminPath === 'pages' ? 'active' : '')}
            href="/admin/pages"
          >
            Seiten
          </a>
          <a
            className={'item ' + (adminPath === 'news' ? 'active' : '')}
            href="/admin/news"
          >
            Aktuelles
          </a>
          <a
            className={'item ' + (adminPath === 'crew' ? 'active' : '')}
            href="/admin/crew"
          >
            Regie & Team
          </a>
          <a
            className={'item ' + (adminPath === 'messages' ? 'active' : '')}
            href="/admin/messages"
          >
            Nachrichten
          </a>
        </div>
        {adminSectionDisplay}
      </section>
    </div>
  );
}

export default Admin;
