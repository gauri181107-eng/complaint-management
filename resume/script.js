const form = document.querySelector('#internshipForm');
const successMessage = document.querySelector('#successMessage');

form.addEventListener('submit', function (event) {
  event.preventDefault();

  successMessage.style.display = 'none';

  const fullName = document.querySelector('#fullName').value.trim();
  const email = document.querySelector('#email').value.trim();
  const phone = document.querySelector('#phone').value.trim();
  const college = document.querySelector('#college').value.trim();
  const branch = document.querySelector('#branch').value;
  const year = document.querySelector('#year').value;
  const skills = document.querySelector('#skills').value.trim();
  const role = document.querySelector('#role').value;
  const why = document.querySelector('#why').value.trim();
  const resume = document.querySelector('#resume').value.trim();

  let isValid = true;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[0-9]{10}$/;
  const urlPattern = /^(https?:\/\/)[^\s]+$/;

  function setError(groupId, condition) {
    const group = document.querySelector('#' + groupId);
    if (condition) {
      group.classList.add('invalid');
      isValid = false;
    } else {
      group.classList.remove('invalid');
    }
  }

  setError('group-fullName', fullName === '');
  setError('group-email', !emailPattern.test(email));
  setError('group-phone', !phonePattern.test(phone));
  setError('group-college', college === '');
  setError('group-branch', branch === '');
  setError('group-year', year === '');
  setError('group-skills', skills === '');
  setError('group-role', role === '');
  setError('group-why', why.length < 20);
  setError('group-resume', !urlPattern.test(resume));

  if (isValid) {
    successMessage.style.display = 'block';
    form.reset();

    document.querySelectorAll('.form-group').forEach(group => {
      group.classList.remove('invalid');
    });

    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    const firstInvalid = document.querySelector('.form-group.invalid');
    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
});