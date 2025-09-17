// tests/budgetValidator.test.ts
import { describe, it, expect } from 'vitest';
import { BuyerCreateSchema } from '@/server/validators/buyer';

describe('budget validator', () => {
    it('should fail when budgetMax < budgetMin', () => {
        const res = BuyerCreateSchema.safeParse({
            fullName: 'Test User',
            phone: '9999999999',
            city: 'Chandigarh',
            propertyType: 'Plot',
            purpose: 'Buy',
            timeline: 'Exploring',
            source: 'Website',
            budgetMin: 1000000,
            budgetMax: 500000
        });
        expect(res.success).toBe(false);
    });

    it('should pass with valid budgets', () => {
        const res = BuyerCreateSchema.safeParse({
            fullName: 'Test User',
            phone: '9999999999',
            city: 'Chandigarh',
            propertyType: 'Plot',
            purpose: 'Buy',
            timeline: 'Exploring',
            source: 'Website',
            budgetMin: 100000,
            budgetMax: 200000
        });
        expect(res.success).toBe(true);
    });
});
