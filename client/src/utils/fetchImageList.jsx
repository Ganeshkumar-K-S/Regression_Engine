export async function fetchImageUrls(folderName, uuid, features) {
    try {
        const res = await fetch('http://localhost:5000/api/get-images', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ folderName, uuid, features }),
            credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) return data;
        else throw new Error(data.error || 'Failed to fetch image data');
    } catch (err) {
        console.error('Error fetching image data:', err);
        return [];
    }
}
