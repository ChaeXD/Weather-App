const { getWeatherByCity } = require('./weather'); // Assuming the weather module is exported

test('getWeatherByCity should throw an error when city is not found', async () => {
  const nonExistentCity = 'NonExistentCity';

  await expect(getWeatherByCity(nonExistentCity)).rejects.toThrow(
    'City not found. Please check the spelling.'
  );
});

// weather.test.js

const { getWeatherDescription } = require('./weather');

test('getWeatherDescription should return valid weather description for all weather codes', () => {
  const weatherCodes = [0, 1, 2, 3, 45, 48, 51, 53, 55, 61, 63, 65, 71, 73, 75, 80, 81, 82, 95];

  weatherCodes.forEach((code) => {
    expect(getWeatherDescription(code)).not.toBe('Unknown weather');
  });
});