import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UtilityService } from 'src/shared/utils/utility.service';
import { Repository } from 'typeorm';
import { Otp } from './otp.entity';
import { OtpService } from './otp.service';

describe('OtpService', () => {
  let service: OtpService;
  let otpRepository: Repository<Otp>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OtpService,
        UtilityService,
        {
          provide: getRepositoryToken(Otp),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<OtpService>(OtpService);
    otpRepository = module.get<Repository<Otp>>(getRepositoryToken(Otp));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateOtp', () => {
    it('should generate and save an OTP', async () => {
      const mockOtp = {
        id: 1,
        code: '123456',
        userId: 1,
        expiresAt: new Date(),
      };
      jest.spyOn(otpRepository, 'save').mockResolvedValue(mockOtp as Otp);

      const result = await service.generateOtp(1);
      expect(result).toEqual(mockOtp);
      expect(otpRepository.save).toHaveBeenCalled();
    });
  });

  describe('validateOtp', () => {
    it('should validate a correct OTP', async () => {
      const mockOtp = {
        id: 1,
        code: '123456',
        userId: 1,
        expiresAt: new Date(Date.now() + 60000),
      };
      jest.spyOn(otpRepository, 'findOne').mockResolvedValue(mockOtp as Otp);

      const result = await service.validateOtp(1, '123456');
      expect(result).toBe(true);
      expect(otpRepository.findOne).toHaveBeenCalledWith({
        where: { userId: 1, code: '123456' },
      });
    });

    it('should return false for an expired OTP', async () => {
      const mockOtp = {
        id: 1,
        code: '123456',
        userId: 1,
        expiresAt: new Date(Date.now() - 60000),
      };
      jest.spyOn(otpRepository, 'findOne').mockResolvedValue(mockOtp as Otp);

      const result = await service.validateOtp(1, '123456');
      expect(result).toBe(false);
    });

    it('should return false for an invalid OTP', async () => {
      jest.spyOn(otpRepository, 'findOne').mockResolvedValue(null);

      const result = await service.validateOtp(1, 'invalid');
      expect(result).toBe(false);
    });
  });
});
