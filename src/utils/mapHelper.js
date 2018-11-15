export function createMap(src) {
    let ref = window.document.getElementsByTagName("script")[0];
    let script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    script.onerror = function () {
        document.write("There was an error loading Google Maps!");
    };
    ref.parentNode.insertBefore(script, ref);
}
