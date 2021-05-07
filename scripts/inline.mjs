export function head() {
  // https://davidwalsh.name/detect-sticky
  const obs = (
    typeof IntersectionObserver === `function`
    ? new IntersectionObserver(onChange, {threshold: [1]})
    : undefined
  )

  function onChange(entries) {
    for (const {target, isIntersecting} of entries) {
      target.classList.toggle(`--stuck`, !isIntersecting)
    }
  }

  class Nav extends HTMLElement {
    connectedCallback()    {if (obs) obs.observe(this)}
    disconnectedCallback() {if (obs) obs.unobserve(this)}
  }
  customElements.define(`a-nav`, Nav)
}
