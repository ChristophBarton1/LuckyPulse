import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LpButton from '~/components/ui/LpButton.vue'

function mountButton(props: Record<string, unknown> = {}, slot = 'Enter Room') {
  return mount(LpButton, {
    props,
    slots: { default: slot },
    global: {
      // <Icon> is transformed to a direct NuxtIcon import, so stub by component name.
      // NuxtLink (imported from #components) renders as a plain <a> here.
      stubs: {
        Icon: true,
        NuxtIcon: true,
        NuxtLink: { props: ['to'], template: '<a :href="to"><slot /></a>' },
      },
    },
  })
}

describe('LpButton', () => {
  it('renders a <button> with the slot label by default', () => {
    const wrapper = mountButton()
    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.text()).toContain('Enter Room')
    expect(wrapper.attributes('type')).toBe('button')
  })

  it('applies the primary variant class by default', () => {
    const wrapper = mountButton()
    expect(wrapper.classes()).toContain('bg-lp-gold-gradient')
  })

  it('switches classes for a different variant', () => {
    const wrapper = mountButton({ variant: 'danger' })
    expect(wrapper.classes()).toContain('bg-lp-red')
    expect(wrapper.classes()).not.toContain('bg-lp-gold-gradient')
  })

  it('emits click when pressed', async () => {
    const wrapper = mountButton()
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('is disabled and marked busy while loading', () => {
    const wrapper = mountButton({ loading: true })
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.attributes('aria-busy')).toBe('true')
  })

  it('does not fire native click handling when disabled (pointer-events removed)', () => {
    const wrapper = mountButton({ disabled: true })
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('pointer-events-none')
  })

  it('renders a link when `to` is provided', () => {
    const wrapper = mountButton({ to: '/rooms/abc' })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('/rooms/abc')
  })

  it('forwards an explicit type', () => {
    const wrapper = mountButton({ type: 'submit' })
    expect(wrapper.attributes('type')).toBe('submit')
  })
})
