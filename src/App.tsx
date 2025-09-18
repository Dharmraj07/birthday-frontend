import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import Confetti from "react-confetti";
import { differenceInSeconds } from "date-fns";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { trackVisit } from "./visitorApi";

// --- Custom hook for countdown ---
const useCountdown = (month: number, day: number, graceDays = 0) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isBirthday, setIsBirthday] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      let targetDate = new Date(now.getFullYear(), month, day);

      if (now > targetDate) {
        const graceEnd = new Date(
          targetDate.getFullYear(),
          targetDate.getMonth(),
          targetDate.getDate() + graceDays
        );

        if (now <= graceEnd) {
          setIsBirthday(true);
          setTimeLeft(0);
          return;
        }

        targetDate = new Date(now.getFullYear() + 1, month, day);
      }

      const diff = differenceInSeconds(targetDate, now);
      setIsBirthday(diff <= 0);
      setTimeLeft(diff > 0 ? diff : 0);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [month, day, graceDays]);

  return { timeLeft, isBirthday };
};

// --- Custom hook for visitor tracking (entry only) ---
const useVisitorTracking = () => {
  useEffect(() => {
    trackVisit(); // send entry info to backend once on load
  }, []);
};

// --- Helper function to format seconds ---
const formatTime = (seconds: number) => {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${days}d : ${hours}h : ${minutes}m : ${secs}s`;
};

const App: React.FC = () => {
  const name = "Miss Manju";
  const month = 10; // November (0-indexed)
  const day = 4;
  const graceDays = 7;

  const { timeLeft, isBirthday } = useCountdown(month, day, graceDays);
  useVisitorTracking();

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Card sx={{ p: 3, borderRadius: "20px", boxShadow: 3 }}>
        <CardContent>
          {/* Birthday Countdown / Celebration */}
          <Box textAlign="center">
            {!isBirthday ? (
              <>
                <Typography variant="h4" gutterBottom>
                  🎂 Birthday Countdown
                </Typography>
                <Typography variant="h6">Countdown for {name} 🎉</Typography>
                <Typography variant="h5" color="primary">
                  {formatTime(timeLeft)}
                </Typography>
              </>
            ) : (
              <>
                <Confetti />
                <Typography variant="h3" color="secondary" gutterBottom>
                  🎉 Happy Birthday {name}! 🎂
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Wishing you lots of happiness, success, and love 💖
                </Typography>

                {/* Proposal Section */}
                <Box mt={4}>
                  <Typography
                    variant="h5"
                    color="primary"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    💌 On this special day, I have something to ask...
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: "'Dancing Script', cursive",
                      color: "#d81b60",
                      mt: 2,
                    }}
                  >
                    be my girlfriend, {name}? ❤️
                  </Typography>
                </Box>
              </>
            )}
          </Box>

          {/* Divider */}
          <Divider sx={{ my: 4 }} />

          {/* Stalingrad Letter */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #fdf6e3, #fceabb)",
              borderRadius: "20px",
              p: 4,
              textAlign: "center",
              boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
              position: "relative",
            }}
          >
            <FormatQuoteIcon
              sx={{
                fontSize: 60,
                color: "rgba(0,0,0,0.2)",
                position: "absolute",
                top: 10,
                left: 20,
              }}
            />
            <Typography
              variant="subtitle1"
              color="text.secondary"
              gutterBottom
              sx={{ fontStyle: "italic", fontWeight: "bold" }}
            >
              In 1942, at the height of the Battle of Stalingrad, a Soviet officer
              wrote a letter to his Beloved:
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: "1.2rem",
                lineHeight: 1.8,
                mt: 2,
              }}
            >
              “If I don’t return, don’t give your heart to the first person out
              of fear of being alone. Wait for someone with whom you feel calm
              even in silence. Someone you can sit with in the kitchen at 3 a.m.
              eating bread and salt and it will taste better than any feast.
              Someone with whom you are not afraid to grow old.”
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                mt: 3,
                fontStyle: "italic",
                color: "text.secondary",
                fontWeight: "500",
              }}
            >
              — Soviet Officer, 1942
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default App;
