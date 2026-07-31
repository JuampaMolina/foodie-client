import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Order } from '../interface/order';
import { OrderCardComponent } from './order-card.component';

describe('OrderCardComponent', () => {
  const order: Order = {
    _id: '1',
    totalPrice: 10,
    date: new Date(),
    status: 'preparing',
    items: [],
  };

  // Fresh fixture per test with isAdmin already set before the first
  // detectChanges(), rather than mutating an already-rendered fixture: doing
  // the latter trips NG0100 inside p-dialog's internal state (see the same
  // workaround in categories.component.spec.ts).
  async function createFixture(
    isAdmin: boolean,
    orderOverride: Order = order
  ): Promise<ComponentFixture<OrderCardComponent>> {
    await TestBed.resetTestingModule()
      .configureTestingModule({ imports: [OrderCardComponent] })
      .compileComponents();

    const fixture = TestBed.createComponent(OrderCardComponent);
    fixture.componentInstance.order = orderOverride;
    fixture.componentInstance.isAdmin = isAdmin;
    fixture.componentInstance.showContent = true;
    fixture.detectChanges();
    return fixture;
  }

  function getSelect(
    fixture: ComponentFixture<OrderCardComponent>
  ): HTMLSelectElement | null {
    return fixture.nativeElement.querySelector('select#status');
  }

  function getCancelButton(
    fixture: ComponentFixture<OrderCardComponent>
  ): HTMLButtonElement | null {
    const buttons: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('button')
    );
    return (
      buttons.find(button => button.textContent?.includes('Cancelar pedido')) ??
      null
    );
  }

  it('should not render the status selector for non-admins', async () => {
    const fixture = await createFixture(false);
    expect(getSelect(fixture)).toBeNull();
  });

  it('should render every status as an option, selected on the current one', async () => {
    const fixture = await createFixture(true);
    const select = getSelect(fixture)!;
    const values = Array.from(select.options).map(option => option.value);
    expect(values).toEqual(['pending', 'preparing', 'delivered']);
    expect(select.value).toBe('preparing');
  });

  it('should emit statusChangeEvent when a different status is picked, including going backwards', async () => {
    const fixture = await createFixture(true);
    const emitted: { orderId: string; status: string }[] = [];
    fixture.componentInstance.statusChangeEvent.subscribe(event =>
      emitted.push(event)
    );

    const select = getSelect(fixture)!;
    select.value = 'pending';
    select.dispatchEvent(new Event('change'));

    expect(emitted).toEqual([{ orderId: '1', status: 'pending' }]);
  });

  it('should not emit when the selected status is the same as the current one', async () => {
    const fixture = await createFixture(true);
    const emitted: unknown[] = [];
    fixture.componentInstance.statusChangeEvent.subscribe(event =>
      emitted.push(event)
    );

    const select = getSelect(fixture)!;
    select.value = 'preparing';
    select.dispatchEvent(new Event('change'));

    expect(emitted).toEqual([]);
  });

  it('should show a cancel button for a pending order viewed by its owner', async () => {
    const pendingOrder: Order = { ...order, status: 'pending' };
    const fixture = await createFixture(false, pendingOrder);
    expect(getCancelButton(fixture)).not.toBeNull();
  });

  it('should not show a cancel button for a non-pending order', async () => {
    const fixture = await createFixture(false);
    expect(getCancelButton(fixture)).toBeNull();
  });

  it('should not show a cancel button to admins', async () => {
    const pendingOrder: Order = { ...order, status: 'pending' };
    const fixture = await createFixture(true, pendingOrder);
    expect(getCancelButton(fixture)).toBeNull();
  });

  it('should emit cancelEvent with the order id when cancelled', async () => {
    const pendingOrder: Order = { ...order, status: 'pending' };
    const fixture = await createFixture(false, pendingOrder);
    const emitted: string[] = [];
    fixture.componentInstance.cancelEvent.subscribe(orderId =>
      emitted.push(orderId)
    );

    getCancelButton(fixture)!.click();

    expect(emitted).toEqual(['1']);
  });
});
