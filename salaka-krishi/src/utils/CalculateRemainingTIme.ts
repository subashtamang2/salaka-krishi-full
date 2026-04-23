
export default function CalculateRemainingTime(date:string) {
    const lastDate = new Date(date);

    const currentDate = new Date().getTime();
    const timeStamp = lastDate.getTime();

    const remainingTimeStamp = timeStamp - currentDate;

    const days = Math.floor(remainingTimeStamp / (1000 * 60 * 60 * 24))

    const afterDaysTimeStamps = remainingTimeStamp % (24 * 60 * 60 * 1000)

    const hours = Math.floor(afterDaysTimeStamps / (1000 * 60 * 60))
    const afterHours = afterDaysTimeStamps % (60 * 60 * 1000)

    const minutes = Math.floor(afterHours / (1000 * 60))

    const afterMin = afterHours % (1000 * 60);

    const sec = Math.floor(afterMin / (1000))

    return {
        days, hours, min: minutes, sec
    }
}
