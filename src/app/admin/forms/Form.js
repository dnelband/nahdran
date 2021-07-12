import PageForm from './PageForm';
import NewsForm from './NewsForm';
import CrewForm from './CrewForm';

function Form(props) {
  let itemId,
    itemType = window.location.pathname.split(props.type + '/')[1];
  if (itemType.indexOf('/') > -1) {
    itemId = itemType.split('/')[1];
    itemType = itemType.split('/')[0];
  }

  let formDisplay;
  if (itemType === 'page')
    formDisplay = <PageForm type={props.type} itemId={itemId} />;
  else if (itemType === 'news')
    formDisplay = <NewsForm type={props.type} itemId={itemId} />;
  else if (itemType === 'crew')
    formDisplay = <CrewForm type={props.type} itemId={itemId} />;

  return (
    <div id="admin-form" className="ui form">
      {formDisplay}
    </div>
  );
}

export default Form;
