import {Box, Button, Container, Heading, Link} from "@chakra-ui/react";
import {useEffect, useRef, useState} from "react";
import ring from "./assets/ring.wav";

const FOCUS_KEY = "focus";
const REST_KEY = "rest";

const FOCUS_TIME = 25 * 60;  // 25 minutes, specified in seconds
const REST_TIME = 5 * 60;    // 5 minutes, specified in seconds

const phaseStyles = {
  [FOCUS_KEY]: {
    color: "#ffffff",
    background: "#DF675B",
    backgroundSecondary: "#e1796e",
  },
  [REST_KEY]: {
    color: "#ffffff",
    background: "#71bd4b",
    backgroundSecondary: "#81c260",
  },
};

const formatTime = (timeInSeconds) => {
  const remainingMinutes = Math.floor(timeInSeconds / 60);
  const remainingSeconds = timeInSeconds % 60;
  return `${String(remainingMinutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
};

function App() {

  const ringSound = new Audio(ring);
  const [phase, setPhase] = useState(FOCUS_KEY);
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const onFocusClick = () => {
    setPhase(FOCUS_KEY);
    setTimeLeft(FOCUS_TIME);
    setIsRunning(false);
  };

  const onRestClick = () => {
    setPhase(REST_KEY);
    setTimeLeft(REST_TIME);
    setIsRunning(false);
  };

  const onStartClick = () => {
    setIsRunning(!isRunning);
  }

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prevState => {
          if (prevState <= 0) {
            ringSound.play();
            setPhase(phase === FOCUS_KEY ? REST_KEY : FOCUS_KEY);
            setIsRunning(false);
            return phase === FOCUS_KEY ? REST_TIME : FOCUS_TIME;
          } else {
            return prevState - 1;
          }
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, phase]);

  return (
    <Box width="100%" height="100vh" background={phaseStyles[phase].background} color={phaseStyles[phase].color}>
      <Container width="container.xl" py={12} centerContent>
        <Box my={2}>
          <Heading as="h1">
            <Link href="https://github.com/duplxey/back4app-containers-react">react-pomodoro</Link>
          </Heading>
          <Heading as="h2" size="md">a simple react pomodoro app</Heading>
        </Box>
        <Box width="100%" display="flex" flexDirection="row" color={phaseStyles[phase].background} my={2}>
          <Button width="100%" mr={2} onClick={onFocusClick}>Focus</Button>
          <Button width="100%" ml={2} onClick={onRestClick}>Rest</Button>
        </Box>
        <Box
          width="100%" background={phaseStyles[phase].backgroundSecondary} display="flex" justifyContent="center"
          p={8} my={2} rounded="md"
        >
          <Heading size="4xl">{formatTime(timeLeft)}</Heading>
        </Box>
        <Box width="100%" my={2}>
          <Button width="100%" color={phaseStyles[phase].background} onClick={onStartClick}>
            {isRunning ? "Pause" : "Start"}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
