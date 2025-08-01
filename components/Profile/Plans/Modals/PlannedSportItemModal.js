import styles from './PlannedSportItemModal.module.css';
import colors from '../../../../styles/Colors.module.css'

const PlannedSportItemModal = ({ showModal, setShowModal, checkSportHandler, deleteSportHandler }) => {
  const { display, content } = showModal;

  if (!display) return null;

  const handleClose = () => {
    setShowModal({ display: false, content: {} });
  };

  const label = content.label

  console.log(label)
  console.log(content)

  const contentHandler = (action, content) =>{

    console.log(action)
    console.log(content)

    if(action === "check"){
      checkSportHandler(content)
    } else if( action === "delete"){
      deleteSportHandler(content)
    }

    setShowModal({display: false, content: {}})

  }


  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={`${styles.modalContent}  ${colors[label] || ""}`} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={handleClose}>✕</button>
        <h2 className={styles.title}>{content.title || 'Unbenannte Einheit'}</h2>
        <p className={styles.subTitle}><strong>Sportart:</strong> {content.name}</p>
        <p className={styles.subTitle}><strong>Dauer:</strong> {content.duration} Minuten</p>
        <p className={styles.subTitle}><strong>Level/Info:</strong> {content.entry}</p>
        <p className={styles.subTitle}><strong>Anbieter:</strong> {content.provider}</p>
        <p className={styles.subTitle}><strong>Status:</strong> {content.status}</p>
        <p className={styles.subTitle}><strong>Datum:</strong> {new Date(content.created_at).toLocaleString('de-DE')}</p>
        <div className='flex w-full justify-end '>
          <button className={styles.done_btn} onClick={() =>contentHandler("check", content)}> done </button>
          <button className={styles.delete_btn} onClick={() =>contentHandler("delete", content)}> delete </button>
        </div>
      
      </div>
    </div>
  );
};

export default PlannedSportItemModal;
