const bookingForm = document.getElementById('booking-form');

bookingForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const name = bookingForm.name.value.trim();
  const phone = bookingForm.phone.value.trim();
  const date = bookingForm.date.value;
  const time = bookingForm.time.value;
  const people = bookingForm.people.value;

  if(!name || !phone || !date || !time || !people) {
    alert('Пожалуйста, заполните все поля.');
    return;
  }

  alert(`Спасибо, ${name}! Ваш стол забронирован на ${date} в ${time} на ${people} гостей.`);
  bookingForm.reset();
});
