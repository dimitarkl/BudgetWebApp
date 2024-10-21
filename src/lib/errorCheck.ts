export function isError(response: any): response is Error {
    return response instanceof Error ||
        (typeof response === 'object' && response !== null && 'message' in response);
}