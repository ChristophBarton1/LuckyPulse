import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LpMetricCard from '~/components/ui/LpMetricCard.vue'

// LpCard is exercised for real (simple div + slots); only icons need stubbing.
function mountMetric(props: InstanceType<typeof LpMetricCard>['$props']) {
  return mount(LpMetricCard, {
    props,
    global: { stubs: { Icon: true, NuxtIcon: true } },
  })
}

describe('LpMetricCard', () => {
  it('renders the label', () => {
    expect(mountMetric({ label: 'Active Users', value: 100 }).text()).toContain('Active Users')
  })

  it('formats a numeric value with thousands separators', () => {
    expect(mountMetric({ label: 'Active Users', value: 24568 }).text()).toContain('24,568')
  })

  it('renders a string value verbatim', () => {
    expect(mountMetric({ label: 'Latency', value: '38ms' }).text()).toContain('38ms')
  })

  it('shows a positive trend in green with a signed delta', () => {
    const wrapper = mountMetric({ label: 'Votes', value: 3620, trend: 12.5 })
    expect(wrapper.text()).toContain('+12.5%')
    expect(wrapper.html()).toContain('text-lp-green')
  })

  it('shows a negative trend in red', () => {
    const wrapper = mountMetric({ label: 'Errors', value: 4, trend: -3 })
    expect(wrapper.text()).toContain('-3.0%')
    expect(wrapper.html()).toContain('text-lp-red')
  })

  it('omits the trend row when no trend is provided', () => {
    const wrapper = mountMetric({ label: 'Rooms', value: 158 })
    expect(wrapper.html()).not.toContain('text-lp-green')
    expect(wrapper.html()).not.toContain('text-lp-red')
  })
})
