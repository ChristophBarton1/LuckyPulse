import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LpBadge from '~/components/ui/LpBadge.vue'

function mountBadge(props: Record<string, unknown> = {}, slot = 'LIVE') {
  return mount(LpBadge, {
    props,
    slots: { default: slot },
    global: { stubs: { Icon: true, NuxtIcon: true } },
  })
}

describe('LpBadge', () => {
  it('renders a span with the slot label', () => {
    const wrapper = mountBadge()
    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.text()).toContain('LIVE')
  })

  it('uses the neutral variant by default', () => {
    expect(mountBadge().classes()).toContain('bg-lp-surface-3')
  })

  it('maps variant -> tinted token classes', () => {
    const wrapper = mountBadge({ variant: 'gold' })
    expect(wrapper.classes()).toContain('bg-lp-gold/15')
    expect(wrapper.classes()).toContain('text-lp-gold')
  })

  it('renders a leading status dot when `dot` is set', () => {
    const wrapper = mountBadge({ variant: 'red', dot: true })
    const dot = wrapper.find('span[aria-hidden="true"]')
    expect(dot.exists()).toBe(true)
    expect(dot.classes()).toContain('bg-lp-red')
  })

  it('pulses the dot (not the badge) when both pulse and dot are set', () => {
    const wrapper = mountBadge({ dot: true, pulse: true })
    expect(wrapper.classes()).not.toContain('animate-lp-live')
    expect(wrapper.find('span[aria-hidden="true"]').classes()).toContain('animate-lp-live')
  })

  it('pulses the whole badge when pulse is set without a dot', () => {
    expect(mountBadge({ pulse: true }).classes()).toContain('animate-lp-live')
  })

  it('switches to mono uppercase type when `uppercase` is set', () => {
    const wrapper = mountBadge({ uppercase: true })
    expect(wrapper.classes()).toContain('font-mono')
    expect(wrapper.classes()).toContain('uppercase')
  })
})
