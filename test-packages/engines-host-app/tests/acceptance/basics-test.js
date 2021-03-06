import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | basics', function(hooks) {
  setupApplicationTest(hooks);

  test('host-app', async function(assert) {
    await visit('/');
    assert.equal(currentURL(), '/');
    assert.dom('[data-test-duplicated-helper]').containsText('from-engines-host-app');
  });

  test('eager-engine', async function(assert) {
    await visit('/use-eager-engine');
    assert.equal(currentURL(), '/use-eager-engine');
    assert.dom('[data-test-eager-engine-main] > h1').containsText('Eager engine');
    assert.dom('[data-test-truth-helpers-ok]').exists();
    assert.dom('[data-test-duplicated-helper]').containsText('from-eager-engine-helper');
  });

  test('styles', async function(assert) {
    await visit('/style-check');
    assert.dom('.shared-style-target').exists();

    assert.equal(
      getComputedStyle(document.querySelector('.shared-style-target'))['border-left-width'],
      '2px',
      'eager-engine styles are present'
    );

    assert.equal(
      getComputedStyle(document.querySelector('.shared-style-target'))['border-right-width'],
      '0px',
      'lazy-engine styles are not present'
    );

    await visit('/use-lazy-engine');
    await visit('/style-check');

    assert.equal(
      getComputedStyle(document.querySelector('.shared-style-target'))['border-left-width'],
      '2px',
      'eager-engine styles are still present'
    );

    assert.equal(
      getComputedStyle(document.querySelector('.shared-style-target'))['border-right-width'],
      '2px',
      'now lazy-engine styles are present'
    );
  });

  test('lazy-engine', async function(assert) {
    await visit('/use-lazy-engine');
    assert.equal(currentURL(), '/use-lazy-engine');
    assert.dom('[data-test-lazy-engine-main] > h1').containsText('Lazy engine');
    assert.dom('[data-test-duplicated-helper]').containsText('from-lazy-engine');
  });
});
