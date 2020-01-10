import { useState, useEffect, useRef } from 'react';
import { Button, Modal, ModalBody, ModalHeader, Row, Col, Alert, Progress } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import Tesseract, { createWorker } from 'tesseract.js';

const MEDIA_WIDTH = 300;
const MEDIA_HEIGHT = 300;

export default function ReceiptScanner({ onReceiptScan }) {
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const toggleScanModal = () => {
    const open = !scanModalOpen;
    setScanModalOpen(open);

    if (open) {
      openStream();
    } else {
      if (stream) {
        closeStream();
      }
    }
  };

  // BEGIN scanner related objects

  const [errorMessage, setErrorMessage] = useState(null);
  const [stream, setStream] = useState(null);
  const [progress, setProgress] = useState(null);
  const [processed, setProcessed] = useState({});

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [cameraIntervalId, setCameraIntervalId] = useState(null);

  const worker = useRef(createWorker({
    logger: (message) => {
      if (message.status === 'recognizing text') {
        setProgress(message.progress);
      }
    }
  }));

  useEffect(() => {
    (async () => {
      if('mediaDevices' in navigator
          && 'getUserMedia' in navigator.mediaDevices
        ){
          await worker.current.load();
          await worker.current.loadLanguage('eng');
          await worker.current.initialize('eng');
          await worker.current.setParameters({
            tessedit_create_box: '1'
          });
      } else {
        setMessage("We're sorry, your host does not support scanning receipts. Please choose another method.");
      }
    })();

    return () => {
      worker.current.terminate();
    };
  }, []);

  const openStream = async () => {
    if (stream) {
      return;
    }

    try {
      const streamObj = await navigator.mediaDevices.getUserMedia({ video: { width: MEDIA_HEIGHT, height: MEDIA_WIDTH } });
      videoRef.current.srcObject = streamObj;

      setStream(streamObj);

      if (!cameraIntervalId) {
        setCameraIntervalId(setInterval(updateCanvas, 50));
      }
    } catch(e) {
      console.error(e)
      setErrorMessage('Uh oh, something went wrong with accessing your camera. Please try again.');
    }
  };

  const closeStream = () => {
    if(!stream) {
      return;
    }

    if (cameraIntervalId) {
      clearInterval(cameraIntervalId);
      setCameraIntervalId(null);
    }

    stream.getTracks().forEach((track) => track.stop());
    setStream(null);
  };

  const processImage = async () => {
    try {
      const { data } = await worker.current.recognize(canvasRef.current);

      if (!data.lines || !(data.lines.length > 0)) {
        setErrorMessage('No lines recognized, please try again.');
        return;
      }

      return data.lines.filter((line) => {
        const lastToken = line.words[line.words.length - 1];
        return lastToken && lastToken.text && lastToken.text.match(/^\$?[+-]?[0-9]{1,3}(?:,?[0-9]{3})*\.[0-9]{2}$/);
      });
    } catch(e) {
      console.error(e);
      setErrorMessage('Uh oh, something went wrong with processing the screenshot. Please try again.');
    }
  }

  const updateCanvas = () => {
    if (canvasRef.current && videoRef.current) {
      canvasRef.current.getContext('2d').drawImage(videoRef.current, 0, 0);
    } else {
      console.error('Uh oh, no video or canvas');
    }
  };

  const analyze = async () => {
    if (canvasRef.current) {
      try {
        const relevantLines = await processImage();

        const proccessedWays = {};
        relevantLines.forEach((line) => {
          drawBoxFor(line.bbox);

          const amount = Number(line.words[line.words.length - 1].text.replace(/[^0-9.-]+/g, ''));
          const wayKey = line.words.map((w) => w.text).slice(0, line.words.length - 1).join(' ');
          const wayInfo = [{ amount }];

          proccessedWays[wayKey] = wayInfo;
        });

        setProcessed(proccessedWays);
      } catch (e) {
        console.error(e);
      }
    } else {
      console.error('Uh oh, no canvas to analyze');
    }
  };

  const takeScreenShot = () => {
    closeStream();
    analyze();
  };

  const drawBoxFor = (boundingBox) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.lineWidth = '2';
    ctx.strokeStyle = 'red';
    ctx.strokeRect(
      boundingBox.x0,
      boundingBox.y0,
      boundingBox.x1 - boundingBox.x0,
      boundingBox.y1 - boundingBox.y0
    );
    ctx.closePath();
  };

  // END scanner related objects

  const onConfirmAmounts = () => {
    toggleScanModal();
    onReceiptScan(processed);
  };

  return (
    <React.Fragment>
      <Button className="mb-3" color="success" onClick={toggleScanModal}>
        <FontAwesomeIcon size="1x" icon={faCamera} />
        Scan receipt
      </Button>

      <Modal isOpen={scanModalOpen} toggle={toggleScanModal}>
        <ModalHeader toggle={toggleScanModal}>Scan receipt</ModalHeader>
        <ModalBody>
          {errorMessage && <Alert variant="danger">{errorMessage}/</Alert>}
          <Row>
            <Col className="text-center">
              <Button className="mr-2 mb-2" color="primary" onClick={takeScreenShot}>Take screenshot</Button>
              <Button className="mb-2" color="success" onClick={openStream}>Take another</Button>

              <video style={{ border: '1px solid black', display: 'none' }} width={MEDIA_WIDTH} height={MEDIA_HEIGHT} autoPlay ref={videoRef} />
              <canvas width={MEDIA_WIDTH} height={MEDIA_HEIGHT} ref={canvasRef} />
            </Col>
          </Row>

          <hr />

          {(progress && progress != 1) && (
            <React.Fragment>
              <div className="text-center">{(progress * 100).toFixed(2)}% analyzed</div>
              <Progress value={progress * 100} />
            </React.Fragment>)
          }
          {Object.keys(processed).map((wayKey) => (
            <div key={wayKey}>
              {wayKey}: {processed[wayKey].map((wayInfo) => `$${wayInfo.amount.toFixed(2)}`).join(', ')}
            </div>
          ))}
          <Button className="mt-2 mr-2" color="primary" onClick={onConfirmAmounts}>Confirm amounts</Button>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};
