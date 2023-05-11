document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.generate-dispatch-url') as HTMLFormElement;
  const urlInput = form.querySelector('input[name=url]') as HTMLInputElement;
  const btnCopy = form.querySelector('button[name=copy]') as HTMLButtonElement;
  const copyResult = form.querySelector('.copy-result') as HTMLElement;
  const inputsContainer = form.querySelector('.inputs') as HTMLDListElement;
  const inputs = inputsContainer.querySelectorAll('input');
  const btnAddInputs = inputsContainer.querySelector('button[name=add-input]') as HTMLButtonElement;

  const requiredParamsCount = 4;
  const maxInputsCount = 10;
  let inputsCount = 1;
  let copyResultTimeout: number;

  btnAddInputs.addEventListener('click', event => {
    event.preventDefault();
    inputs.forEach(input => {
      input = addInputListener(input.cloneNode() as HTMLInputElement);
      input.value = '';
      btnAddInputs.before(input);
    });
    inputsCount++;
    if (inputsCount >= maxInputsCount) {
      btnAddInputs.remove();
    }
  });

  form.querySelectorAll('input').forEach(element => addInputListener(element));

  btnCopy.addEventListener('click', event => {
    event.preventDefault();
    navigator.clipboard
      .writeText(urlInput.value)
      .then(() => setCopyResult(true))
      .catch(() => setCopyResult(false));
  });

  function setCopyResult(success: boolean) {
    copyResult.innerHTML = success ? 'Copied!' : 'Failed…';
    copyResult.classList.remove(success ? 'failure' : 'success');
    copyResult.classList.add(success ? 'success' : 'failure', 'result');
    window.clearTimeout(copyResultTimeout);
    window.setTimeout(() => {
      copyResult.classList.remove('result');
    }, 3000);
  }

  function addInputListener(input: HTMLInputElement): HTMLInputElement {
    input.addEventListener('keyup', () => {
      urlInput.value = generateURL();
      btnCopy.disabled = urlInput.value === '';
    });
    return input;
  }

  function generateURL(): string {
    const [params, inputs] = [...new FormData(form).entries()].reduce(
      ([params, inputs], [key, value]) => {
        value = (value as string).trim();
        if (key !== 'url') {
          value = encodeURIComponent(value);
          if (key === 'name') {
            inputs.push([value]);
          } else if (key === 'value') {
            (inputs.at(-1) as string[]).push(value);
          } else if (value !== '') {
            params.push(value);
          }
        }
        return [params, inputs];
      },
      [[], []] as [string[], ([string, string] | [string])[]]
    ) as [string[], [string, string][]];

    if (params.length === requiredParamsCount) {
      const url = new URL(location.toString());
      url.hash = '';
      url.pathname = `/dispatch/${params.join('/')}`;
      const query = inputs.reduce((query, [name, value]) => {
        if (name.length > 0 && value.length > 0) query.set(name, value);
        return query;
      }, new URLSearchParams());
      url.search = query.toString();
      return url.toString();
    }
    return '';
  }
});
