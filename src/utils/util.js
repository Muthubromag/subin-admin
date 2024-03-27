import Sound from "../assets/notify.mp3";
const audio = new Audio(Sound);

function formatTime(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${formattedHours}:${formattedMinutes} ${ampm}`;
}
export function generateTimeSlots({ interval }) {
  const startTime = "2024-03-06T10:00:00"; // Replace with your desired start time
  const endTime = "2024-03-06T23:00:00";
  const timeSlots = [];
  let currentStartTime = new Date(startTime);
  const endDateTime = new Date(endTime);

  while (currentStartTime < endDateTime) {
    const currentEndTime = new Date(
      currentStartTime.getTime() + interval * 60 * 60 * 1000
    );

    const formattedStartTime = formatTime(currentStartTime);
    const formattedEndTime = formatTime(currentEndTime);

    timeSlots.push({ time: `${formattedStartTime} - ${formattedEndTime}` });

    currentStartTime = currentEndTime;
  }

  return timeSlots;
}

export async function playSound() {
  if (audio) {
    audio.loop = true;
    await audio.play();
  }
}

export function stopSound() {
  if (audio) {
    audio.pause();
    audio.currentTime = 0; // Reset audio playback position to the beginning
  }
}

export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180; // convert degrees to radians
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
}
