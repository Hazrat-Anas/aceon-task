const SecToSecMin = (seconds) => {
    console.log(seconds)
    let minutes = ~~(seconds / 60);
    let extraSeconds = seconds % 60;
    return `${minutes} minutes, ${extraSeconds} seconds`
}
export { SecToSecMin }