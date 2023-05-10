document.addEventListener('DOMContentLoaded', () => {
  const el = document.querySelector('.subline.column-item') as HTMLAnchorElement;

  let count = 5;

  function countdown() {
    el.innerHTML = `Redirecting${count > 0 ? ` in ${count}` : ''}…`;
    if (count > 0) {
      window.setTimeout(countdown, 1000);
      count--;
    } else {
      window.location.href = '{{ workflowURL }}';
    }
  }

  countdown();
});
