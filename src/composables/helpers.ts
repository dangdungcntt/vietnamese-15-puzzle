export function shuffle(array: any[]) {
    const length = array == null ? 0 : array.length
    if (!length) {
        return []
    }
    let index = -1
    const lastIndex = length - 1
    const result = [...array]
    while (++index < length) {
        const rand = index + Math.floor(Math.random() * (lastIndex - index + 1))
        const value = result[rand]
        result[rand] = result[index]
        result[index] = value
    }
    return result
}

export function millisecondsToStr(milliseconds: number) {
    function numberEnding(number: number) {
        return (number > 1) ? 's' : '';
    }

    let temp = Math.floor(milliseconds / 1000);
    let result = '';
    let hours = Math.floor(temp / 3600);
    if (hours) {
        temp -= hours * 3600;
        result += hours + ' hour' + numberEnding(hours);
    }
    let minutes = Math.floor(temp / 60);
    if (minutes) {
        temp -= minutes * 60;
        result += ' ' + minutes + ' minute' + numberEnding(minutes);
    }
    let seconds = temp % 60;
    if (seconds) {
        result += ' ' + seconds + ' second' + numberEnding(seconds);
    }

    return result.trim() || 'less than a second';
}