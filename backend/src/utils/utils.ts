const random = (len: number): string => {
    const options = 'qwugiuoidksdhoihd274684kfiehf869747053';
    const length = options.length;

    let ans = "";
    for (let i = 0; i < len; i++) {
        const r = Math.floor(Math.random() * length);
        ans += options[r];
    }
    return ans;
};


export default random;