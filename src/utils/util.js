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
