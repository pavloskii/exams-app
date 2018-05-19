export default (value) => {
    const formated = value.toLowerCase().replace(/_/g, " ");

    return formated.charAt(0).toUpperCase() + formated.slice(1);
}