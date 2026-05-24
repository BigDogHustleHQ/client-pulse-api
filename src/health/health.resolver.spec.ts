import { Test, TestingModule } from '@nestjs/testing';
import { HealthResolver } from './health.resolver';

describe('HealthResolver', () => {
  let resolver: HealthResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthResolver],
    }).compile();

    resolver = module.get<HealthResolver>(HealthResolver);
  });

  it('health returns ok', () => {
    expect(resolver.health()).toEqual('ok');
  });
});
