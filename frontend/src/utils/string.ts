export const sliceContent = (content: string, maxSize: number) => {
    const firstLineBreak = content.indexOf('\n');

    if (firstLineBreak !== -1 && firstLineBreak < maxSize) {
        return content.slice(0, firstLineBreak) + '...';
    }

    return content.length > maxSize
        ? content.slice(0, maxSize) + '...'
        : content;
};
