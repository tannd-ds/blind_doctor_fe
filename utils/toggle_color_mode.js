export default async function () {
    useColorMode().preference = useColorMode().value === 'dark' ? 'light' : 'dark';
}